package me.holzenkamp.games.tschausepp.business;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class AdminOverview {
    Integer numberOfMatches;
    List<String> timestamps;
}
