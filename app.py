from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import json

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS respostas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            frequencia_visita TEXT NOT NULL,
            prefere_opcao_vegana TEXT NOT NULL,
            tem_alergia TEXT NOT NULL,
            quais_alergias TEXT,
            satisfacao_geral INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/formulario', methods=['GET', 'POST'])
def formulario():
    if request.method == 'POST':
        nome = request.form['nome']
        frequencia_visita = request.form['frequencia_visita']
        prefere_opcao_vegana = request.form['prefere_opcao_vegana']
        tem_alergia = request.form['tem_alergia']
        quais_alergias = request.form.get('quais_alergias', '')
        satisfacao_geral = int(request.form['satisfacao_geral'])

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO respostas (nome, frequencia_visita, prefere_opcao_vegana, tem_alergia, quais_alergias, satisfacao_geral)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (nome, frequencia_visita, prefere_opcao_vegana, tem_alergia, quais_alergias, satisfacao_geral))
        conn.commit()
        conn.close()

        return redirect(url_for('graficos'))
    return render_template('formulario.html')

@app.route('/graficos')
def graficos():
    conn = get_db_connection()
    respostas = conn.execute('SELECT * FROM respostas').fetchall()
    conn.close()

    respostas_dict = [dict(row) for row in respostas]
    return render_template('graficos.html', respostas=respostas_dict)


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
