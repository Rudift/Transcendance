# **************************************************************************** #
#                                    PROJECT                                   #
# **************************************************************************** #

.DEFAULT_GOAL:= up
NAME:= Transcendance

# **************************************************************************** #
#                                     TOOLS                                    #
# **************************************************************************** #

SHELL:= /bin/bash
RM:= rm -rf

# **************************************************************************** #
#                                     COLORS                                   #
# **************************************************************************** #

GREEN:= \033[0;32m
YELLOW:= \033[0;33m
RED:= \033[0;31m
BLUE:= \033[0;34m
WHITE:= \033[1;37m
BOLD:= \033[1m
NC:= \033[0m

# **************************************************************************** #
#                                 CONFIGURATION                                #
# **************************************************************************** #

# Docker Compose
COMPOSE_FILE?= compose.yml
COMPOSE:= docker compose -f $(COMPOSE_FILE)

# PKI (Public Key Infrastructure)
PKI_SCRIPT:= pki_gen.sh
PKI_FLAG:= .pki/.generated
SSL_DIRS:= gateway/ssl bff/ssl

# **************************************************************************** #
#                               PKI GENERATION                                 #
# **************************************************************************** #

pki-gen: $(PKI_FLAG)

$(PKI_FLAG): $(PKI_SCRIPT)
	@printf "$(YELLOW)🛡️  Génération des certificats PKI...$(NC)\n"
	@bash $(PKI_SCRIPT)
	@mkdir -p $$(dirname $(PKI_FLAG))
	@touch $(PKI_FLAG)
	@printf "$(GREEN)✅ Certificats générés$(NC)\n"

pki-clean:
	@printf "$(YELLOW)🧽 Nettoyage des certificats PKI...$(NC)\n"
	@$(RM) $(SSL_DIRS) .pki
	@printf "$(GREEN)✅ Certificats PKI supprimés$(NC)\n"

# **************************************************************************** #
#                              DOCKER ORCHESTRATION                            #
# **************************************************************************** #

up: $(PKI_FLAG)
	@printf "$(YELLOW) Construction des images...$(NC)\n"
	@$(COMPOSE) build
	@printf "$(YELLOW) Démarrage des conteneurs...$(NC)\n"
	@$(COMPOSE) up -d
	@printf "$(GREEN)✅ Conteneurs démarrés$(NC)\n"
	@$(COMPOSE) ps

down:
	@printf "$(YELLOW)🛑 Arrêt des conteneurs...$(NC)\n"
	@$(COMPOSE) down
	@printf "$(GREEN)✅ Conteneurs arrêtés$(NC)\n"

build:
	@printf "$(YELLOW)🔨 Construction des images...$(NC)\n"
	@$(COMPOSE) build
	@printf "$(GREEN)✅ Images construites$(NC)\n"

rebuild: down
	@printf "$(YELLOW)🔨 Reconstruction complète (no-cache)...$(NC)\n"
	@$(COMPOSE) build --no-cache
	@$(RM) .pki
	@$(MAKE) up
	@printf "$(GREEN)✅ Rebuild terminé$(NC)\n"

logs:
	@$(COMPOSE) logs -f

ps:
	@$(COMPOSE) ps

# **************************************************************************** #
#                              DEPENDENCY MANAGEMENT                           #
# **************************************************************************** #

deps:
	@printf "$(YELLOW)🔗 Récupération des images depuis le registry...$(NC)\n"
	@$(COMPOSE) pull --ignore-pull-failures || true
	@printf "$(GREEN)✅ Images récupérées$(NC)\n"# **************************************************************************** #
#                                   CLEANING                                   #
# **************************************************************************** #

clean:
	@printf "$(YELLOW)🧹 Nettoyage des conteneurs et volumes...$(NC)\n"
	@$(COMPOSE) down -v
	@printf "$(GREEN)✅ Nettoyage terminé$(NC)\n"

fclean: clean pki-clean
	@printf "$(RED)🗑️  Suppression complète des images Docker...$(NC)\n"
	@$(COMPOSE) down -v --rmi all
	@printf "$(GREEN)✅ Nettoyage complet terminé$(NC)\n"

re: fclean up

# **************************************************************************** #
#                                     HELP                                     #
# **************************************************************************** #

help:
	@printf "$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(NC)\n"
	@printf "$(GREEN)$(BOLD)                    $(NAME) - Makefile                    $(NC)\n"
	@printf "$(GREEN)$(BOLD)═══════════════════════════════════════════════════════════$(NC)\n"
	@printf "\n"
	@printf "$(YELLOW)PKI (Certificats SSL):$(NC)\n"
	@printf "  $(WHITE)make pki-gen$(NC)      Génère les certificats via $(PKI_SCRIPT)\n"
	@printf "  $(WHITE)make pki-clean$(NC)    Supprime les certificats et le flag PKI\n"
	@printf "\n"
	@printf "$(YELLOW)Docker (compose: $(COMPOSE_FILE)):$(NC)\n"
	@printf "  $(WHITE)make$(NC) ou $(WHITE)make up$(NC)  Génère PKI si besoin + build + démarre\n"
	@printf "  $(WHITE)make down$(NC)         Arrête les conteneurs\n"
	@printf "  $(WHITE)make build$(NC)        Construit les images Docker\n"
	@printf "  $(WHITE)make rebuild$(NC)      Reconstruction no-cache + redémarrage\n"
	@printf "  $(WHITE)make logs$(NC)         Affiche les logs en temps réel\n"
	@printf "  $(WHITE)make ps$(NC)           Statut des conteneurs\n"
	@printf "\n"
	@printf "$(YELLOW)Maintenance:$(NC)\n"
	@printf "  $(WHITE)make deps$(NC)         Pull les images depuis le registry\n"
	@printf "  $(WHITE)make clean$(NC)        Nettoie conteneurs + volumes\n"
	@printf "  $(WHITE)make fclean$(NC)       Nettoyage complet (images + certificats)\n"
	@printf "  $(WHITE)make re$(NC)           fclean puis up (rebuild complet)\n"
	@printf "  $(WHITE)make help$(NC)         Affiche cette aide\n"
	@printf "\n"


# **************************************************************************** #
#                                    PHONY                                     #
# **************************************************************************** #

.PHONY: all help pki-gen pki-clean up down build rebuild logs ps deps clean \
	fclean re
