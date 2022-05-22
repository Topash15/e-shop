const express = require('express');
const path = require('path');
const db = require('./config/connection');
const {ApolloServer} = require('apollo-server-express');

const {typeDefs, resolvers} = require('./schemas');

const startServer = async() => {
    const server = new ApolloServer ({
        typeDefs,
        resolvers
    })

    await server.start();

    server.applyMiddleware({app});

    console.log(`GraphQL Test: http://localhost:${PORT}${server.graphqlPath}`);
}

startServer();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

if(process.env.NODE_env === 'production') {
    app.use(express.static(path.join(__dirname, "../client/build")));
}

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../clientbuild/index.html'));
// })

db.once("open", ()=>{
    app.listen(PORT, ()=> {
        console.log(`API server running at localhost: ${PORT}}`)
    })
});