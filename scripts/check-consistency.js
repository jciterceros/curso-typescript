async function checkConsistency() {
  const listRes = await fetch('http://localhost:3000/tickets');
  const listData = await listRes.json();
  console.log('Formato Listagem (tem .data):', !!listData.data);

  const showRes = await fetch('http://localhost:3000/tickets/t1');
  const showData = await showRes.json();
  console.log('Formato Detalhes (direto):', !!showData.id);

  const createRes = await fetch('http://localhost:3000/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: "Teste", description: "Consistência" })
  });
  const createData = await createRes.json();
  console.log('Formato Criação (tem .ticket):', !!createData.ticket);
}

checkConsistency();