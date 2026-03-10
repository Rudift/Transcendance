/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   README.md                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: vdeliere <vdeliere@student.42.fr>          #+#  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2026-03-09 15:33:48 by vdeliere          #+#    #+#             */
/*   Updated: 2026-03-09 15:33:48 by vdeliere         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

# Architecture Devops pour Transcendance
    Partie Devops comprenant:
        - Architecture micro-service
        - Exemple de front stocké dans le bff
        - Capture des métriques avec Prometheus et Cadvisor
        - Display des métriques via un dashboard Grafana
        - Gestion des alertes sur les métriques avec AlertManager

## Installation
    A la racine du projet taper "make" dans le terminal

## Utilisation
    Le site hébergé par cette architecture est disponible à l'adresse: https://localhost:8443
    
    Vous pourrez accéder à Grafana à l'adresse suivante: https://localhost:8443/grafana
    Le service grafana vous demandera ensuite de vous logger.
    Vous pourrez trouver l'indentifiant et le mot de passe dans le .env.

    Pour accéder au dashboard: cliquez sur Dashboard puis 42Hub.
    Pour monitorer les alertes: dérouler le menu Alerting puis cliquez sur Alert rules

## Commandes Makefile
    - all:
        - Génère les certificats
        - Build les conteneurs
        - Lance les conteneurs
        - Supprime les certificats
    
    - help:
        - Affiche les commandes Makefile disponible et décrit sommairement leur fonctionnement
    
    - pki-gen:
        - Génère les certificats dans le dossier .pki

    - pki-clean:
        - Supprime le dossier .pki et le dossiers SSL du gateway et du BFF

    - pki-clean-temp:
        - Supprime le dossier .pki
    
    - up:
        - Démarre les conteneurs

    - down:
        - Arrête les conteneurs

    - build:
        - Lance la construction des conteneurs

    - rebuild:
        - Reconstruit l'intégralité des conteneurs

    - logs:
        - Affiche les logs du docker compose

    - ps:
        - Affiche les conteneurs actifs

    - deps:
        - Récupère les images depuis le registry

    - clean:
        - Arrête les conteneurs
        - Supprime les conteneurs, réseaux et volumes

    - fclean:
        - Arrête les conteneurs
        - Supprime les conteneurs, réseaux, volumes et les images associées
    
    - re:
        - Arrête les conteneurs
        - Supprime les conteneurs, réseaux, volumes et les images associées
        - Génère les certificats
        - Build les conteneurs
        - Lance les conteneurs
        - Supprime les certificats
    