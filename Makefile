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
	@echo "Iniciando la base de datos..."
	docker compose up -d

detenerBdd:
	@echo "Deteneniendo la ejecución de la base de datos..."
	docker compose stop

eliminarBdd:
	@echo "Eliminando la base de datos..."
	docker compose down







