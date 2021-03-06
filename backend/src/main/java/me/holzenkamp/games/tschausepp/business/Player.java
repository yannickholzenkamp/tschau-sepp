package me.holzenkamp.games.tschausepp.business;

import lombok.Builder;
import lombok.Value;
import me.holzenkamp.games.tschausepp.business.cards.Card;

import java.util.ArrayList;
import java.util.List;

@Value
@Builder
public class Player {
    private int id;
    private String name;
    private List<Card> cards = new ArrayList<>();
}
