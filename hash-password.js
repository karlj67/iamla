const bcryptjs = require('bcryptjs');

async function hashPassword() {
    const password = '@Karljess2023';
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Password:', password);
    console.log('Hashed password:', hashedPassword);
}

hashPassword(); 