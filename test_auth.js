const API_URL = 'http://localhost:3000';

async function testLogin() {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Login Status:', response.status);
    const data = await response.json();
    console.log('Login Response:', data);
  } catch (error) {
    console.error('Erro no login:', error);
  }
}

async function testRegister() {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });

    console.log('Register Status:', response.status);
    const data = await response.json();
    console.log('Register Response:', data);
  } catch (error) {
    console.error('Erro no registro:', error);
  }
}

// Executar os testes
testLogin();
testRegister();