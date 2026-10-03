import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import bcrypt from 'bcrypt';

export default async function seedUsers() {
    const existingUsers = await userRepository.getAll();
    const adminExists = existingUsers.some(u => u.roles.some(r => r.name === 'admin'));

    if (!adminExists) {
        let adminRole = await roleRepository.findByName('admin');
        if (!adminRole) adminRole = await roleRepository.create({ name: 'admin' });

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashedPassword = await bcrypt.hash('Admin123@', saltRounds);

        await userRepository.create({
            email: 'admin@tecsuplab.com',
            password: hashedPassword,
            name: 'Administrador',
            lastName: 'Sistema',
            phoneNumber: '987654321',
            birthdate: new Date('1990-01-01'),
            url_profile: 'https://via.placeholder.com/150',
            address: 'Av. Tecsup 123',
            roles: [adminRole._id]
        });

        console.log('Seeded Admin User: admin@tecsuplab.com / Pass: Admin123@');
    }
}