package me.holzenkamp.games.tschausepp.business;

import me.holzenkamp.games.tschausepp.business.cards.Card;
import me.holzenkamp.games.tschausepp.business.cards.CardNumber;
import me.holzenkamp.games.tschausepp.business.cards.StackOfCards;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class Match {
    private static final int START_CARDS = 7;

    private final long created;
    private final StackOfCards stackOfCards;
    private List<Player> players = new ArrayList<>();
    private MatchState state = MatchState.CREATED;
    private Player activePlayer;
    private Integer round = 0;
    private Player winner;

    public Match() {
        this.stackOfCards = new StackOfCards();
        this.stackOfCards.setUpStack();
        created = System.currentTimeMillis();
    }

    public Player joinMatch(String name) {
        Player player = Player.builder().id(players.size()).name(name).build();
        players.add(player);
        return player;
    }

    public long getCreated() {
        return created;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public MatchState getState() {
        return state;
    }

    public Integer getRound() {
        return round;
    }

    public Player getWinner() {
        return winner;
    }

    public Integer getSevens() {
        return this.stackOfCards.getSevens();
    }

    public List<Card> getDiscarded() {
        return this.stackOfCards.getDiscarded();
    }

    public Player getActivePlayer() {
        return activePlayer;
    }

    public Card getLastDiscardedCard() {
        return stackOfCards.lastDiscarded();
    }

    public void startGame() {
        if (MatchState.CREATED.equals(state)) { // only startable if not already started
            state = MatchState.STARTED;
            for (int i = 0; i < START_CARDS; i++) {
                for (Player player : players) {
                    player.getCards().add(stackOfCards.draw());
                }
            }

            activePlayer = players.get(0);
            stackOfCards.put(stackOfCards.draw());
        }
    }

    public void nextPlayer() {
        if (activePlayer.getId() == 0) {
            round++;
        }
        int nextPlayerId = activePlayer.getId() + 1;
        activePlayer = players.get(nextPlayerId < players.size() ? nextPlayerId : 0);
    }

    public Card drawCard(int playerId) {
        Card card = stackOfCards.draw();
        players.get(playerId).getCards().add(card);
        return card;
    }

    public void putCard(int playerId, Card card) {
        if (!CardNumber.WUNSCH.equals(card.getNumber())) {
            boolean removed = players.get(playerId).getCards().remove(card);
            if (!removed) {
                throw new RuntimeException("card is not available");
            }
        }
        stackOfCards.put(card);
        this.checkIfFinished();
    }

    private void checkIfFinished() {
        Optional<Player> possibleWinner = players.stream().filter(player -> player.getCards().size() < 1).findAny();
        if (possibleWinner.isPresent()) {
            state = MatchState.OVER;
            winner = possibleWinner.get();
        }
    }
}
