package me.holzenkamp.games.tschausepp.application;

import lombok.Builder;
import lombok.Value;
import me.holzenkamp.games.tschausepp.business.MatchState;
import me.holzenkamp.games.tschausepp.business.Player;
import me.holzenkamp.games.tschausepp.business.cards.Card;

import java.util.List;

@Value
@Builder
public class GameMeta {
    private String id;
    private Integer playerId;
    private List<Player> players;
    private MatchState state;
    private Player activePlayer;
    private Card lastDiscardedCard;
    private List<Card> allDiscarded;
    private Integer round;
    private Player winner;
    private Integer sevens;
}
