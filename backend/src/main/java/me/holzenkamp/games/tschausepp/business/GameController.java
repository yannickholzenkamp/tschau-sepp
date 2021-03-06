package me.holzenkamp.games.tschausepp.business;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class GameController {

    private final static long AGE_LIMIT = 1000 * 60 * 2; // 2 minutes

    Map<String, Match> matches = new HashMap<>();

    public String newMatch() {
        cleanUp();
        String gameId = newGameId();
        matches.put(gameId, new Match());
        return gameId;
    }

    public Match getMatch(String gameId) {
        return matches.get(gameId);
    }

    private String newGameId() {
        String gameId = RandomStringUtils.randomAlphabetic(5).toUpperCase();
        if (matches.containsKey(gameId)) {
            return newGameId();
        }
        return gameId;
    }

    private void cleanUp() {
        Iterator<String> iterator = matches.keySet().iterator();

        while (iterator.hasNext()) {
            String key = iterator.next();
            long age = (System.currentTimeMillis() - matches.get(key).getCreated());
            if (age > AGE_LIMIT) {
                iterator.remove();
            }
        }
    }

    public AdminOverview getAdminOverview() {
        List<String> timestamps = matches.keySet().stream().map(key -> {
            long ts = matches.get(key).getCreated();
            long age = (System.currentTimeMillis() - ts) / (1000 * 60);
            return "Age: " + age + " Minutes.";
        }).collect(Collectors.toList());

        return AdminOverview.builder()
                .numberOfMatches(matches.size())
                .timestamps(timestamps)
                .build();
    }

}
