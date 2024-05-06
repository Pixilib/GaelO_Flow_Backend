## Stop redis:

```
sudo /etc/init.d/redis-server stop
```

```
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:23.0.6 start-dev
```

## TODO NEXT

TESTS PROCESSING CONTROLLER 
TESTS PROCESSING QUEUE