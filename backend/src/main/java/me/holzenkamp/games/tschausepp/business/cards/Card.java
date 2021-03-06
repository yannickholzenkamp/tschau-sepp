package me.holzenkamp.games.tschausepp.business.cards;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Card {
    private CardType type;
    private CardNumber number;
}
