# Mémoire projet IA

Ce dossier contient la mémoire persistante du projet pour les agents IA (Cursor, Claude, etc.).

## Fichiers

| Fichier | Rôle |
|---------|------|
| `project-context.md` | Contexte général : objectif, stack, contraintes métier, architecture |
| `decisions.md` | Journal des décisions d'architecture (ADR léger) |

## Comment utiliser ces fichiers

### En tant qu'agent IA

- Lis `project-context.md` en début de session avant de proposer une modification structurelle.
- Consulte `decisions.md` pour comprendre les choix passés et éviter de les remettre en question sans raison.
- Documente toute nouvelle décision d'architecture dans `decisions.md` en suivant le format établi.

### En tant que développeur

- Mets à jour `project-context.md` quand l'objectif, la stack ou les contraintes évoluent.
- Ajoute une entrée dans `decisions.md` pour chaque décision structurelle non triviale.
- Ces fichiers remplacent les longues explications en début de conversation avec l'IA.

## Format d'une décision (decisions.md)

```markdown
## [YYYY-MM-DD] Titre court

**Contexte :** Pourquoi cette décision était nécessaire.
**Décision :** Ce qui a été choisi.
**Alternatives écartées :** Ce qui a été considéré mais rejeté, et pourquoi.
**Conséquences :** Impact attendu (positif et négatif).
```
