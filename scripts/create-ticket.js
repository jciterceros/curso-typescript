async function createTicket() {
  const response = await fetch('http://localhost:3000/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: "Problema na VPN",
      description: "Não consigo conectar no servidor de produção",
      status: "open-erro",
      priority: "2",
      assigneeId: "u2"
    })
  });

  const data = await response.json();
  console.log('--- Resposta do POST /tickets ---');
  console.log(JSON.stringify(data, null, 2));
}

createTicket();