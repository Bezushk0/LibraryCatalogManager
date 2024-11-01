from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from pymongo import MongoClient
import os

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Підключення до MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['web']
users_collection = db['users']

# Функція для реєстрації
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')  # Роль за замовчуванням - 'user'
    
    if not username or not password:
        return jsonify({"error": "Заповніть всі поля!"}), 400
    
    user = {"username": username, "password": password, "role": role}
    users_collection.insert_one(user)
    return jsonify({"message": "Реєстрація пройшла успішно!"}), 201

# Функція для входу
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = users_collection.find_one({"username": username, "password": password})
    if user:
        session['username'] = username
        session['role'] = user['role']
        
        if user['role'] == 'admin':
            return redirect(url_for('admin_home'))
        else:
            return redirect(url_for('user_home'))
    else:
        return jsonify({"error": "Неправильне ім'я користувача або пароль"}), 401

# Маршрут для головної сторінки адміністратора
@app.route('/admin_home')
def admin_home():
    if session.get('role') == 'admin':
        return render_template('admin_home.html')
    return redirect(url_for('index'))

# Маршрут для головної сторінки користувача
@app.route('/user_home')
def user_home():
    if session.get('role') == 'user':
        return render_template('user_home.html')
    return redirect(url_for('index'))

# Головна сторінка
@app.route('/')
def index():
    return render_template('index.html')
    
if __name__ == '__main__':
    app.run(debug=True)
