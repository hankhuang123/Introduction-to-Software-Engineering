Setup for backend:
Your working directory should be on ./backend
```bash
mkdir data
cd data
mkdir db
cd ..
mongod --dbpath=.\data\db
```
Remember to have the npm install in your working directory
If not, run command:
```npm i```