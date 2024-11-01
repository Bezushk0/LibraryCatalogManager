from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)
app.secret_key = "d2f7f1e4d6724b5b80d45d68fbd26312"

# Налаштування MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['web']
users_collection = db['users']

# Загальна функція для пошуку користувача
def find_user_by_field(field, value):
    return users_collection.find_one({field: value})

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username, password, email = data.get('username'), data.get('password'), data.get('email')
    role = data.get('role', 'user')

    # Перевірка на наявність всіх полів
    if not all([username, password, email]):
        return jsonify({"error": "Заповніть всі поля!"}), 400

    if find_user_by_field("email", email):
        return jsonify({"error": "Ця електронна пошта вже зареєстрована!"}), 400

    if find_user_by_field("username", username):
        return jsonify({"error": "Це ім'я користувача вже зайнято!"}), 400

    users_collection.insert_one({"username": username, "password": password, "email": email, "role": role})
    return jsonify({"message": "Реєстрація пройшла успішно!"}), 201

@app.route('/login', methods=['POST'])
def login():
    username, password = request.json.get('username'), request.json.get('password')
    user = find_user_by_field("username", username)

    if user and user.get('password') == password:
        session['username'], session['role'] = username, user.get('role')
        redirect_url = url_for('admin_home' if session['role'] == 'admin' else 'user_home')
        return jsonify({"redirect_url": redirect_url})

    return jsonify({"error": "Невірний логін або пароль"}), 401

@app.route('/profile', methods=['GET'])
def profile():
    username = session.get('username')
    if username:
        user = find_user_by_field("username", username)
        if user:
            return jsonify({'name': user.get('username'), 'email': user.get('email')})
    return jsonify({'error': 'Необхідно увійти в систему'}), 401

@app.route('/admin_home')
def admin_home():
    if session.get('role') == 'admin':
        return render_template('admin_home.html')
    return redirect(url_for('index'))

@app.route('/user_home')
def user_home():
    role = session.get('role')
    if role == 'admin':
        return redirect(url_for('admin_home'))
    elif role == 'user':
        return render_template('user_home.html')
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/')
def index():
    return render_template('index.html', username=session.get('username'), role=session.get('role'))

# Керування книгами
@app.route('/admin/books', methods=['GET', 'POST'])
def manage_books():
    if request.method == 'GET':
        books = list(db.books.find())
        for book in books:
            book['_id'] = str(book['_id'])
        return jsonify(books)

    if request.method == 'POST':
        data = request.json
        title, author, isbn = data.get('title'), data.get('author'), data.get('isbn')

        if not all([title, author, isbn]):
            return jsonify({"error": "Заповніть всі поля!"}), 400

        db.books.insert_one({"title": title, "author": author, "isbn": isbn, "status": "available", "reserved_by": None})
        return jsonify({"message": "Книгу успішно додано!"}), 201

@app.route('/admin/books/<book_id>', methods=['DELETE', 'PUT'])
def book_detail(book_id):
    if request.method == 'DELETE':
        db.books.delete_one({"_id": ObjectId(book_id)})
        return jsonify({"message": "Книгу успішно видалено!"})

    if request.method == 'PUT':
        data = request.json
        db.books.update_one({"_id": ObjectId(book_id)}, {"$set": data})
        return jsonify({"message": "Книгу успішно оновлено!"})

@app.route('/admin/users', methods=['GET'])
def get_users():
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@app.route('/admin/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "Користувача успішно видалено!"})

@app.route('/admin/users/<user_id>', methods=['PUT'])
def update_user_role(user_id):
    new_role = request.json.get('role')
    if new_role:
        users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": new_role}})
        return jsonify({"message": "Роль користувача успішно оновлено!"})
    return jsonify({"error": "Неправильна роль!"}), 400

@app.route('/reserve_book/<book_id>', methods=['POST'])
def reserve_book(book_id):
    username = session.get('username')
    if not username:
        return jsonify({"error": "Необхідно увійти в систему!"}), 401

    book = db.books.find_one({"_id": ObjectId(book_id)})
    if book:
        if book.get("status") == "available":
            db.books.update_one({"_id": ObjectId(book_id)}, {"$set": {"status": "reserved", "reserved_by": username}})
            return jsonify({"message": "Книга успішно заброньована!"}), 200
        return jsonify({"error": "Книга вже заброньована!"}), 400
    return jsonify({"error": "Книга не знайдена!"}), 404

@app.route('/admin/books/reserved', methods=['GET'])
def get_reserved_books():
    reserved_books = list(db.books.find({"status": "reserved"}))
    for book in reserved_books:
        book['_id'] = str(book['_id'])
    return jsonify(reserved_books)

if __name__ == '__main__':
    app.run(debug=True)
