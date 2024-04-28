FROM quay.io/keycloak/keycloak:24.0.3 as builder

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:10.5.0.5" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:24.0.3
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV KC_HOSTNAME=10.5.0.5
ENV KC_HOSTNAME_PORT=5432
ENV KC_HOSTNAME_STRICT="false"
ENV KC_HOSTNAME_STRICT_HTTPS="false"
ENV KC_HTTP_ENABLED="true"
ENV KC_PROXY=edge

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]