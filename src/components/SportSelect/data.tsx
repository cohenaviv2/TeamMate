import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import styles from "./SportSelect.scss"

export const sportTypeIconMap = {
  All: <FontAwesome6 name="medal" style={styles.allSportsIcon} />,
  Basketball: <FontAwesome6 name="basketball" style={styles.basketballIcon} />,
  Baseball: <FontAwesome6 name="baseball" style={styles.baseballIcon} />,
  Tennis: <Ionicons name="tennisball" style={styles.tennisIcon} />,
  Football: <FontAwesome6 name="football" style={styles.footballIcon} />,
  Soccer: <FontAwesome6 name="soccer-ball" style={styles.soccerIcon} />,
  Hockey: <FontAwesome6 name="hockey-puck" style={styles.hockeyIcon} />,
  Volleyball: <FontAwesome6 name="volleyball" style={styles.volleyballIcon} />,
  Golf: <FontAwesome6 name="golf-ball-tee" style={styles.golfIcon} />,
  Cycling: <FontAwesome6 name="person-biking" style={styles.bicycleIcon} />,
  Running: <FontAwesome6 name="person-running" style={styles.runningIcon} />,
  Swimming: <FontAwesome6 name="person-swimming" style={styles.swimmingIcon} />,
  "Ping Pong": <FontAwesome6 name="table-tennis-paddle-ball" style={styles.pingPongIcon} />,
  Skating: <MaterialIcons name="skateboarding" style={styles.skateboardingIcon} />,
  Snowboarding: <FontAwesome6 name="person-snowboarding" style={styles.snowboardingIcon} />,
  Surfing: <MaterialIcons name="surfing" style={styles.surfingIcon} />,
};
