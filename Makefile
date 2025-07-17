inicializar:
	@echo "Descargarndo archivos necesarios..."
	npm install

iniciarFrontend:
	@echo "Iniciando el frontend..."
	npm run frontend

iniciarBackend:
	@echo "Iniciando el backend..."
	npm start

iniciarBdd:
	@eco "Iniciando la base de datos..."
	docker compose up -d

detenerBdd:
	@eco "Deteneniendo la ejecución de la base de datos..."
	docker compose stop

eliminarBdd:
	@eco "Eliminando la base de datos..."
	docker compose down







