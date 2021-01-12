const mongoose = require('mongoose');
const Post = require('../models/post');

const dbUrl = 'mongodb://localhost:27017/chitter';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Post.deleteMany({});
    for(let i = 0; i < 50; i++){
        const post = new Post({
            body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
            author: '5ffd4fe0010f6d5a69d06063'
        });
        await post.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});