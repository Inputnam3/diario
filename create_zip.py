import os
import zipfile

def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        # Excluir diretórios indesejados
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git', 'dist', 'venv')]
        for file in files:
            # Excluir arquivos indesejados
            if not file.endswith(('.env', '.log', '.tmp')) and not file.startswith('.'):
                ziph.write(os.path.join(root, file))

if __name__ == '__main__':
    zipf = zipfile.ZipFile('natuzap.zip', 'w', zipfile.ZIP_DEFLATED)
    zipdir('.', zipf)
    zipf.close()