# Teste de resolução DNS
Write-Host "Testando resolução DNS..."
$dnsResult = Resolve-DnsName -Name db.xpdpdxjrithvzgfbetvz.supabase.co -ErrorAction SilentlyContinue

if ($dnsResult) {
    Write-Host "✅ DNS resolvido com sucesso:" -ForegroundColor Green
    $dnsResult | Format-Table -AutoSize
    
    # Teste de ping
    Write-Host "`nTestando ping..."
    $pingResult = Test-Connection -ComputerName db.xpdpdxjrithvzgfbetvz.supabase.co -Count 2 -ErrorAction SilentlyContinue
    
    if ($pingResult) {
        Write-Host "✅ Ping bem-sucedido!" -ForegroundColor Green
        $pingResult | Format-Table -AutoSize
    } else {
        Write-Host "❌ Falha no ping. O host pode estar bloqueando as requisições ICMP." -ForegroundColor Yellow
    }
    
    # Teste de porta TCP (PostgreSQL)
    Write-Host "`nTestando conexão TCP na porta 5432..."
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $connection = $tcpClient.BeginConnect("db.xpdpdxjrithvzgfbetvz.supabase.co", 5432, $null, $null)
    $success = $connection.AsyncWaitHandle.WaitOne(5000, $false)  # 5 segundos de timeout
    
    if ($success) {
        Write-Host "✅ Conexão TCP na porta 5432 bem-sucedida!" -ForegroundColor Green
        $tcpClient.EndConnect($connection) | Out-Null
    } else {
        Write-Host "❌ Falha na conexão TCP na porta 5432. Verifique o firewall ou se o serviço está ativo." -ForegroundColor Red
    }
    $tcpClient.Close()
    
} else {
    Write-Host "❌ Falha ao resolver o DNS. Verifique sua conexão com a internet." -ForegroundColor Red
}

# Teste de conexão com o Node.js
Write-Host "`nTestando conexão com Node.js..."
$nodeScript = @'
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: 'qazwsxedcrfv123',
    host: 'db.xpdpdxjrithvzgfbetvz.supabase.co',
    port: 5432,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
});

console.log('Conectando ao banco de dados...');

client.connect()
    .then(() => console.log('✅ Conexão bem-sucedida!'))
    .catch(err => console.error('❌ Erro:', err.message))
    .finally(() => client.end());
'@

# Salva o script em um arquivo temporário
$tempFile = [System.IO.Path]::GetTempFileName() + '.js'
$nodeScript | Out-File -FilePath $tempFile -Encoding utf8

# Executa o script Node.js
node $tempFile

# Remove o arquivo temporário
Remove-Item $tempFile -ErrorAction SilentlyContinue
