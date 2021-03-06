package me.holzenkamp.games.tschausepp.application;

import me.holzenkamp.games.tschausepp.business.AdminOverview;
import me.holzenkamp.games.tschausepp.business.GameController;
import me.holzenkamp.games.tschausepp.business.Match;
import me.holzenkamp.games.tschausepp.business.Player;
import me.holzenkamp.games.tschausepp.business.cards.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
public class GameRestController {

    private GameController gameController;

    @Autowired
    public GameRestController(GameController gameController) {
        this.gameController = gameController;
    }

    @GetMapping("/api/games/create")
    public GameMeta createGame() {
        String gameId = gameController.newMatch();
        return GameMeta.builder().id(gameId).build();
    }

    @GetMapping("/api/games/{gameId}/join")
    public GameMeta joinGame(@PathVariable("gameId") String gameId, @RequestParam(name = "name") String playerName) {
        Match match = getMatch(gameId);
        Player player = match.joinMatch(playerName);
        return GameMeta.builder().id(gameId).playerId(player.getId()).players(match.getPlayers()).build();
    }

    @GetMapping("/api/games/{gameId}")
    public GameMeta getGame(@PathVariable("gameId") String gameId) {
        Match match = getMatch(gameId);
        return GameMeta.builder()
                .id(gameId)
                .players(match.getPlayers())
                .state(match.getState())
                .activePlayer(match.getActivePlayer())
                .lastDiscardedCard(match.getLastDiscardedCard())
                .allDiscarded(match.getDiscarded())
                .round(match.getRound())
                .winner(match.getWinner())
                .sevens(match.getSevens())
                .build();
    }

    @GetMapping("/api/games/{gameId}/start")
    public GameMeta startGame(@PathVariable("gameId") String gameId) {
        Match match = getMatch(gameId);
        match.startGame();
        return GameMeta.builder().id(gameId).players(match.getPlayers()).state(match.getState()).build();
    }

    @GetMapping("/api/games/{gameId}/next")
    public GameMeta nextPlayer(@PathVariable("gameId") String gameId) {
        Match match = getMatch(gameId);
        match.nextPlayer();
        return GameMeta.builder().id(gameId).players(match.getPlayers()).build();
    }

    @GetMapping("/api/games/{gameId}/cards")
    public Card drawCard(@PathVariable("gameId") String gameId, @RequestParam(name = "player") int playerId) {
        Match match = getMatch(gameId);
        return match.drawCard(playerId);
    }

    @PostMapping("/api/games/{gameId}/cards")
    public GameMeta putCard(@PathVariable("gameId") String gameId, @RequestParam(name = "player") int playerId, @RequestBody Card card) {
        Match match = getMatch(gameId);
        match.putCard(playerId, card);
        return GameMeta.builder().id(gameId).players(match.getPlayers()).build();
    }

    @GetMapping("/api/admin/games")
    public AdminOverview adminOverview() {
        return gameController.getAdminOverview();
    }

    private Match getMatch(String gameId) {
        Match match = gameController.getMatch(gameId);
        if (match == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "match not found");
        }
        return match;
    }

}
