process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const db = require('../db');
const Book = require('../models/book');

describe('Book routes', () => {
    let isbn;
    let amazon_url;
    let author;
    let language;
    let pages;
    let publisher;
    let title;
    let year;
    beforeEach(async () => {
        await db.query('DELETE from books');
        const bookResult = await db.query(`
            INSERT INTO books (
                isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year)
                VALUES ('12345', 'http://a.co/eobPtX2', 'John Doe', 'English', 100, 'Publisher 1', 'Test Book', 2000)
                RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`
            );
        isbn = bookResult.rows[0].isbn;
        amazon_url = bookResult.rows[0].amazon_url;
        author = bookResult.rows[0].author;
        language = bookResult.rows[0].language;
        pages = bookResult.rows[0].pages;
        publisher = bookResult.rows[0].publisher;
        title = bookResult.rows[0].title;
        year = bookResult.rows[0].year;
        
    });

    afterEach(async () => {
        isbn = null;

    });
    
    describe('GET /books', () => {
        test('should return all books', async () => {
            const res = await request(app).get('/books');
            const { body } = res;
            expect(res.status).toBe(200);
            expect(body).toHaveProperty('books', [{
                isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            }]);
        })
    });

    describe('GET /books/:id', () => {
        test('should return a single book', async () => {
            const res = await request(app).get(`/books/${isbn}`);
            const { body } = res;
            expect(res.status).toBe(200);
            expect(body).toHaveProperty('book', {
                isbn,
                amazon_url,
                author,
                language,
                pages,
                publisher,
                title,
                year
            });
        });

        test('should return 404 if book does not exist', async () => {
            const res = await request(app).get('/books/11111');
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error', { message: "There is no book with an isbn '11111", status: 404 });
        });
    });

    describe('POST /books', () => {

    });
    

    afterAll(async () => {
        await db.end();
    });
});