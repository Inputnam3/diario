import sys
import os

print("--- sys.path ---")
for p in sys.path:
    print(p)
print("----------------")

# Adiciona o diretório raiz do projeto ao sys.path para garantir que 'backend' seja encontrado
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Tenta importar o módulo principal do backend
try:
    import backend.app.main
    print("Successfully imported backend.app.main")
except ModuleNotFoundError as e:
    print(f"ModuleNotFoundError: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
