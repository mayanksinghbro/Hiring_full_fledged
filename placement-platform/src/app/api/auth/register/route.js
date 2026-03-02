import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create the user and their specific profile in a transaction
        const newUser = await db.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: role.toUpperCase(), // STUDENT, COMPANY, COLLEGE
                }
            });

            // Create empty profile based on role
            if (user.role === 'STUDENT') {
                await tx.student.create({
                    data: { userId: user.id }
                });
            } else if (user.role === 'COMPANY') {
                await tx.company.create({
                    data: {
                        userId: user.id,
                        name: name || 'New Company'
                    }
                });
            } else if (user.role === 'COLLEGE') {
                await tx.college.create({
                    data: {
                        userId: user.id,
                        name: name || 'New College'
                    }
                });
            }

            return user;
        });

        return NextResponse.json({
            message: 'User registered successfully',
            user: { email: newUser.email, role: newUser.role }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
