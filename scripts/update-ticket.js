async function updateTicket() {
  const response = await fetch('http://localhost:3000/tickets/t1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: "closed",
      createdAt: "1990-01-01T00:00:00Z",
      extra_field: "isso não deveria estar aqui"
    })
  });

  const data = await response.json();
  console.log('--- Resposta do PATCH /tickets/t1 ---');
  console.log(JSON.stringify(data, null, 2));
}

updateTicket();