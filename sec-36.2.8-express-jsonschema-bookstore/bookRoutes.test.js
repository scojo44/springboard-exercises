// Jest does this: process.NODE_ENV = 'test'
const request = require('supertest');
const app = require('./app');
const db = require('./db');
const Book = require('./models/book');

afterAll(async () => db.end());

describe('Express Bookstore Tests', () => {
  let book1, book2;

  beforeEach(async () => {
    const result1 = await db.query(`
      INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
      VALUES('0735619670', 'https://a.co/d/isHYhW1', 'Steve McConnell', 'English', 960, 'Microsoft Press', 'Code Complete', 2004)
      RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`
    );
    book1 = result1.rows[0];
    
    const result2 = await db.query(`
      INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
      VALUES('0135957052', 'https://a.co/d/9DiEq0T', 'David Thomas, Andrew Hunt', 'English', 352, 'Addison-Wesley', 'Pragmatic Programmer, 20th Anniversary Edition', 2019)
      RETURNING isbn, amazon_url, author, language, pages, publisher, title, year`
    );
      
    book2 = result2.rows[0];
  });

  afterEach(async () => await db.query("DELETE FROM books"));

  describe('GET /books - Get all books', () => {
    test('Can get all books', async () => {
      const response = await request(app).get('/books')
      expect(response.status).toBe(200);
      expect(response.body).toEqual({books: [book1, book2]});
    })
  });

  describe('GET /books/:isbn - Get one book', () => {
    test('Can get a book', async () => {
      const response = await request(app).get(`/books/${book1.isbn}`)
      expect(response.status).toBe(200);
      expect(response.body).toEqual({book: book1});
    })

    test('Non-existent book returns a 404', async () => {
      const response = await request(app).get(`/books/9999999999`)
      expect(response.status).toBe(404);
    });
  });

  describe('POST /books - Create a book entry', () => {
    test('Can add a book', async () => {
      const book3 = {
        isbn: "0201657880",
        amazon_url: "https://a.co/d/7WPgMjP",
        author: "Jon Bentley",
        language: "english",
        pages: 256,
        publisher: "Addison-Wesley",
        title: "Programming Pearls 2nd Edition",
        year: 1999
      }

      const response = await request(app).post(`/books`).send(book3);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({book: book3});
    })

    test('Bad book data rejected', async () => {
      const book3 = {
        isbn: true,
        amazon_url: "https://a.co/d/7WPgMjP",
        author: "Jon Bentley",
        language: "english",
        pages: 'xyzzy',
        publisher: "Addison-Wesley",
        title: "Programming Pearls 2nd Edition",
        year: 1999
      }
      const errors = [
        "instance.isbn is not of a type(s) string",
        "instance.pages is not of a type(s) integer"
      ]
      const response = await request(app).post(`/books`).send(book3);
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual(errors);
    })
  });

  describe('PUT /books/:isbn - Replace a book', () => {
    test('Can change book details for a given ISBN', async () => {
      const book4 = {
        amazon_url: "https://a.co/d/33693O2",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        language: "english",
        pages: 416,
        publisher: "Addison-Wesley",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        year: 1994
      }
      const response = await request(app).put(`/books/${book1.isbn}`).send(book4);
      book4.isbn = book1.isbn; // Response will have ISBN
      expect(response.status).toBe(200);
      expect(response.body).toEqual({book: book4});

      // Make sure book1 is gone
      const response2 = await request(app).get('/books')
      expect(response2.status).toBe(200);
      expect(response2.body).toEqual({books: [book4, book2]});
    })

    test('Bad book data rejected', async () => {
      const book4 = {
        amazon_url: "https://a.co/d/33693O2",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        language: "english",
        pages: "xyzzy",
        publisher: "Addison-Wesley",
        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
        year: 1994
      }
      const errors = [
        "instance.pages is not of a type(s) integer"
      ]
      const response = await request(app).put(`/books/${book1.isbn}`).send(book4);
      expect(response.status).toBe(400);
      expect(response.body.error.message).toEqual(errors);
    })

    test('Try to change ISBN rejected', async () => {
      const book5 = {
        isbn: 9780321965516,
        amazon_url: "https://a.co/d/7IXIyq2",
        author: "Steve Krug",
        language: "english",
        pages: 216,
        publisher: "New Riders",
        title: "Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability (3rd Edition)",
        year: 2013
      }
      const response = await request(app).put(`/books/9999999999`).send(book5);
      expect(response.status).toBe(400);
    })

    test('Non-existent book returns a 404', async () => {
      const book5 = {
        amazon_url: "https://a.co/d/7IXIyq2",
        author: "Steve Krug",
        language: "english",
        pages: 216,
        publisher: "New Riders",
        title: "Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability (3rd Edition)",
        year: 2013
      }
      const response = await request(app).put(`/books/9999999999`).send(book5);
      expect(response.status).toBe(404);
    })
  });

  describe('DELETE /books/:isbn - Delete a book', () => {
    test('Can delete a book', async () => {
      const response = await request(app).delete(`/books/${book2.isbn}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({message: "Book deleted"});

      // Make sure book2 is gone
      const response2 = await request(app).get('/books')
      expect(response2.status).toBe(200);
      expect(response2.body.books[0]).toMatchObject(book1);
    })

    test('Non-existent book returns a 404', async () => {
      const response = await request(app).delete(`/books/9999999999`);
      expect(response.status).toBe(404);
    })
  });
})