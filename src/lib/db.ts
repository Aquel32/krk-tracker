"use server";
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'kmk',
});

export async function Query(sql:string):Promise<any> {
  try {
    const [results] = await connection.query(sql);
    return results;
  } catch (err) {
    return Promise.reject(err);
  }
}