const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@clusterteste-muzfy.azure.mongodb.net/bdteste?retryWrites=true&w=majority',{ //That will connect with my webcluster
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
});