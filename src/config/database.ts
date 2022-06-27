const mongoose = require('mongoose');

const URI: string = process.env.MONGO_URI as string;

exports.connectDB = async () => {
  try {
    await mongoose.connect(URI);

    console.log('Connected To Database Successfully');

  }catch(err) {
    console.log('Database Connection Failed. Exiting Now...');
    console.error(err);
    process.exit(1);
  }
}