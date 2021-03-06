package me.holzenkamp.games.tschausepp.business.cards;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class StackOfCards {

    private List<Card> cards = new ArrayList<>();
    private List<Card> discarded = new ArrayList<>();

    public void setUpStack() {
        cards = generateDeck();
        Collections.shuffle(cards);
    }

    public Card draw() {
        if (cards.isEmpty()) {
            cards = generateDeck();
            Collections.shuffle(cards);
        }
        return cards.remove(0);
    }

    public void put(Card card) {
        discarded.add(card);
    }

    public Card lastDiscarded() {
        if (discarded.size() > 0) {
            return discarded.get(discarded.size() - 1);
        }
        return null;
    }

    private List<Card> generateDeck() {
        List<Card> cards = new ArrayList<>();
        for (CardType type : CardType.values()) {
            for (CardNumber number : CardNumber.values()) {
                if (!CardNumber.WUNSCH.equals(number)) {
                    cards.add(Card.builder().type(type).number(number).build());
                }
            }
        }
        return cards;
    }

    public List<Card> getDiscarded() {
        return discarded;
    }

    public Integer getSevens() {
        int sevens = 0;
        if (this.discarded.size() > 0) {
            for (int i = (this.discarded.size() - 1); i >= 0; i--) {
                if (CardNumber.SIEBEN.equals(this.discarded.get(i).getNumber())) {
                    sevens++;
                } else {
                    break;
                }
            }
        }
        return sevens;
    }
}
