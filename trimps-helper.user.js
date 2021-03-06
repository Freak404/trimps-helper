// ==UserScript==
// @match https://trimps.github.io/
// @match http://trimps.github.io/
// ==/UserScript==
function trimpsHelper() {
    var game = window.game;

    function getEquipmentArray() {
        var eq = game.equipment;

        return Object.keys(eq).map(function(key) {
            eq[key].name = key;
            return eq[key];
        });
    }

    function calculateCost(cost, level) {
        return cost[0] * Math.pow(cost[1], level);
    }

    function calculateWeaponScore(weapon) {
        return weapon.attackCalculated / calculateCost(weapon.cost.metal, weapon.level);
    }

    function calculateArmorScore(armor) {
        return armor.healthCalculated / calculateCost(armor.cost.metal, armor.level);
    }

    function isUnlocked(equipment) {
        return equipment.locked == 0;
    }

    function isWeapon(equipment) {
        return !!equipment.attack;
    }

    function isArmor(equipment) {
        return !!equipment.health && !equipment.block;
    }

    function getBestWeapon() {
        return getEquipmentArray().filter(isWeapon).filter(isUnlocked).sort(function(a, b) {
            return calculateWeaponScore(b) - calculateWeaponScore(a);
        })[0];
    }

    function getBestArmor() {
        return getEquipmentArray().filter(isArmor).filter(isUnlocked).sort(function(a, b) {
            return calculateArmorScore(b) - calculateArmorScore(a);
        })[0];
    }

    function highlight(id) {
        document.getElementById(id).style.color = "#9f9";
    }

    function unhighlight(id) {
        document.getElementById(id).style.color = "inherit";
    }

    var highlightBestEquipment = (function() {
        var highlighted = [];

        return function() {
            var bestWeapon = getBestWeapon().name;
            var bestArmor = getBestArmor().name;

            highlighted.forEach(unhighlight);
            highlighted.splice(0, highlighted.length);

            highlight(bestWeapon);
            highlight(bestArmor);

            highlighted.push(bestWeapon);
            highlighted.push(bestArmor);
        };
    })();

    document.getElementById("buyContainer").onclick = highlightBestEquipment;
    highlightBestEquipment();
}

var script = document.createElement("script");
script.textContent = "(" + trimpsHelper.toString() + ")();";
document.body.appendChild(script);
