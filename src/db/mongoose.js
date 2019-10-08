const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{ //That will connect with my webcluster
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
});