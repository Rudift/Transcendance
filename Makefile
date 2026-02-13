.PHONY: all up down build clean fclean re logs ps help

# Couleurs pour les messages
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
ORANGE = \033[0;33m
WHITE = \033[1;37m
BOLD = \033[1m
NC = \033[0m # No Color

# Fichier de dépendance pour éviter de regénérer les certificats
PKI_FLAG = .pki/.generated

# Banner ASCII
define BANNER
$(WHITE)
 ██   ██  ██████  
 ██   ██     ██  ██
 ███████  █████  ███
      ██  ██       ██
      ██  ███████  ██
$(ORANGE)
 ██   ██ ██    ██ ██████  
 ██   ██ ██    ██ ██   ██ 
 ███████ ██    ██ ██████  
 ██   ██ ██    ██ ██   ██ 
 ██   ██  ██████  ██████  
$(NC)
endef
export BANNER

# Commande par défaut
all: banner up

# Affiche le banner
banner:
	@echo "$$BANNER"

# Lance le script PKI puis démarre les conteneurs
up: $(PKI_FLAG)
	@echo "$(YELLOW)🚀 Démarrage des conteneurs Docker...$(NC)"
	@docker compose up -d
	@echo "$(GREEN)✅ Conteneurs démarrés$(NC)"
	@docker compose ps

# Génère les certificats seulement si nécessaire
$(PKI_FLAG): pki_gen.sh
	@echo "$(YELLOW)🛡️  Génération des certificats SSL...$(NC)"
	@bash pki_gen.sh
	@mkdir -p .pki
	@touch $(PKI_FLAG)
	@echo "$(GREEN)✅ Certificats générés$(NC)"

# Arrête les conteneurs
down:
	@echo "$(YELLOW)🛑 Arrêt des conteneurs...$(NC)"
	@docker compose down
	@echo "$(GREEN)✅ Conteneurs arrêtés$(NC)"

# Build les images sans démarrer
build:
	@echo "$(YELLOW)🔨 Construction des images...$(NC)"
	@docker compose build
	@echo "$(GREEN)✅ Images construites$(NC)"

# Rebuild complet + démarrage
rebuild: down
	@echo "$(YELLOW)🔨 Reconstruction complète...$(NC)"
	@docker compose build --no-cache
	@rm -f $(PKI_FLAG)
	@$(MAKE) $(PKI_FLAG)
	@docker compose up -d
	@echo "$(GREEN)✅ Rebuild terminé$(NC)"

# Affiche les logs
logs:
	@docker compose logs -f

# Affiche le statut des conteneurs
ps:
	@docker compose ps

# Nettoie les conteneurs et réseaux
clean:
	@echo "$(YELLOW)🧹 Nettoyage des conteneurs et réseaux...$(NC)"
	@docker compose down -v
	@echo "$(GREEN)✅ Nettoyage terminé$(NC)"

# Nettoie tout (conteneurs, volumes, images, certificats)
fclean: clean
	@echo "$(RED)🗑️  Suppression complète (images + certificats)...$(NC)"
	@docker compose down -v --rmi all
	@rm -rf gateway/ssl/*.pem bff/ssl/*.pem .pki 2>/dev/null || true
	@echo "$(GREEN)✅ Nettoyage complet terminé$(NC)"

# Relance tout depuis zéro
re: fclean all

# Aide
help:
	@echo "$(GREEN)Makefile Docker Compose$(NC)"
	@echo ""
	@echo "Commandes disponibles:"
	@echo "  $(YELLOW)make$(NC) ou $(YELLOW)make up$(NC)     - Génère les certificats et démarre les conteneurs"
	@echo "  $(YELLOW)make down$(NC)           - Arrête les conteneurs"
	@echo "  $(YELLOW)make build$(NC)          - Construit les images sans démarrer"
	@echo "  $(YELLOW)make rebuild$(NC)        - Reconstruit tout et redémarre"
	@echo "  $(YELLOW)make logs$(NC)           - Affiche les logs en temps réel"
	@echo "  $(YELLOW)make ps$(NC)             - Affiche le statut des conteneurs"
	@echo "  $(YELLOW)make clean$(NC)          - Supprime conteneurs et volumes"
	@echo "  $(YELLOW)make fclean$(NC)         - Supprime tout (+ images + certificats)"
	@echo "  $(YELLOW)make re$(NC)             - Relance tout depuis zéro"
	@echo "  $(YELLOW)make help$(NC)           - Affiche cette aide"
