import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  Switch,
  StyleSheet,
  Platform,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

type Task = {
  id: string;
  title: string;
  dueLabel?: string;
  completed?: boolean;
  tag?: string;
};

type Reminder = {
  id: string;
  title: string;
  timeLabel: string;
  group: "Today" | "Tomorrow" | "Later";
  done?: boolean;
};

const Tab = createBottomTabNavigator();

const theme = {
  bg: "#0B1020",
  panel: "#121A33",
  panel2: "#0F1730",
  text: "#EAF0FF",
  subtext: "rgba(234,240,255,0.72)",
  muted: "rgba(234,240,255,0.45)",
  border: "rgba(234,240,255,0.12)",
  accent: "#7C5CFF",
  good: "#38D39F",
  warn: "#FFB020",
  danger: "#FF5C7C",
};

function ScreenShell(props: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={styles.hTitle}>{props.title}</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>{props.right}</View>
      </View>
      <View style={{ flex: 1 }}>{props.children}</View>
    </View>
  );
}

function Card(props: { title?: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <View style={styles.card}>
      {(props.title || props.subtitle) && (
        <View style={{ marginBottom: 10 }}>
          {!!props.title && <Text style={styles.cardTitle}>{props.title}</Text>}
          {!!props.subtitle && <Text style={styles.cardSubtitle}>{props.subtitle}</Text>}
        </View>
      )}
      {props.children}
    </View>
  );
}

function Pill(props: { label: string; tone?: "accent" | "good" | "warn" | "danger" | "muted" }) {
  const bg =
    props.tone === "good"
      ? "rgba(56,211,159,0.18)"
      : props.tone === "warn"
      ? "rgba(255,176,32,0.18)"
      : props.tone === "danger"
      ? "rgba(255,92,124,0.18)"
      : props.tone === "muted"
      ? "rgba(234,240,255,0.12)"
      : "rgba(124,92,255,0.22)";

  const fg =
    props.tone === "good"
      ? theme.good
      : props.tone === "warn"
      ? theme.warn
      : props.tone === "danger"
      ? theme.danger
      : props.tone === "muted"
      ? theme.subtext
      : theme.accent;

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: theme.border }]}>
      <Text style={[styles.pillText, { color: fg }]}>{props.label}</Text>
    </View>
  );
}

function RowButton(props: { title: string; subtitle?: string; right?: React.ReactNode; onPress?: () => void }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [styles.rowBtn, pressed && { opacity: 0.8 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{props.title}</Text>
        {!!props.subtitle && <Text style={styles.rowSubtitle}>{props.subtitle}</Text>}
      </View>
      {props.right ?? <Text style={{ color: theme.muted, fontSize: 18 }}>›</Text>}
    </Pressable>
  );
}

function Checkbox(props: { checked?: boolean; onToggle?: () => void }) {
  return (
    <Pressable
      onPress={props.onToggle}
      style={[
        styles.checkbox,
        {
          backgroundColor: props.checked ? "rgba(124,92,255,0.28)" : "transparent",
          borderColor: props.checked ? "rgba(124,92,255,0.6)" : theme.border,
        },
      ]}
    >
      <Text style={{ color: props.checked ? theme.accent : theme.muted, fontWeight: "700" }}>
        {props.checked ? "✓" : ""}
      </Text>
    </Pressable>
  );
}

/* -------------------- Dashboard -------------------- */

function DashboardScreen() {
  const today = useMemo<Task[]>(
    () => [
      { id: "t1", title: "Standup notes + blockers", dueLabel: "9:30 AM", tag: "Work" },
      { id: "t2", title: "Pay electricity bill", dueLabel: "2:00 PM", tag: "Personal" },
      { id: "t3", title: "Gym (pull day)", dueLabel: "6:30 PM", tag: "Health" },
    ],
    []
  );

  const right = (
    <>
      <Pressable style={styles.iconBtn}>
        <Text style={styles.iconBtnText}>＋</Text>
      </Pressable>
      <Pressable style={[styles.iconBtn, { backgroundColor: theme.panel2 }]}>
        <Text style={styles.iconBtnText}>⟲</Text>
      </Pressable>
    </>
  );

  return (
    <ScreenShell title="Dashboard" right={right}>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Card title="Today" subtitle="Your at-a-glance plan">
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={styles.bigNumber}>3</Text>
                  <Text style={styles.smallLabel}>Tasks</Text>
                </View>
                <View>
                  <Text style={styles.bigNumber}>2</Text>
                  <Text style={styles.smallLabel}>Reminders</Text>
                </View>
                <View>
                  <Text style={styles.bigNumber}>1</Text>
                  <Text style={styles.smallLabel}>Events</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>

        <Card title="Quick actions" subtitle="Move faster with shortcuts">
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable style={[styles.actionBtn, { backgroundColor: "rgba(124,92,255,0.20)" }]}>
              <Text style={styles.actionBtnTitle}>New Task</Text>
              <Text style={styles.actionBtnSubtitle}>Add in 5 seconds</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { backgroundColor: "rgba(56,211,159,0.18)" }]}>
              <Text style={styles.actionBtnTitle}>New Reminder</Text>
              <Text style={styles.actionBtnSubtitle}>Time-based alert</Text>
            </Pressable>
          </View>
        </Card>

        <Card title="Today’s focus" subtitle="Top items you planned">
          <View style={{ gap: 10 }}>
            {today.map((t) => (
              <View key={t.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{t.title}</Text>
                  <Text style={styles.itemMeta}>
                    {t.dueLabel} • <Text style={{ color: theme.subtext }}>{t.tag}</Text>
                  </Text>
                </View>
                <Pill label="Open" tone="accent" />
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScreenShell>
  );
}

/* -------------------- Calendar -------------------- */

function CalendarScreen() {
  const [selected, setSelected] = useState<number>(3);

  const days = useMemo(
    () => [
      { d: "Mon", n: 1 },
      { d: "Tue", n: 2 },
      { d: "Wed", n: 3 },
      { d: "Thu", n: 4 },
      { d: "Fri", n: 5 },
      { d: "Sat", n: 6 },
      { d: "Sun", n: 7 },
    ],
    []
  );

  const agenda = useMemo(
    () => [
      { id: "a1", time: "10:00 AM", title: "Design review", tag: "Meeting" },
      { id: "a2", time: "1:00 PM", title: "Deep work block", tag: "Focus" },
      { id: "a3", time: "5:30 PM", title: "Dentist appointment", tag: "Personal" },
    ],
    []
  );

  return (
    <ScreenShell title="Calendar">
      <View style={{ padding: 16, gap: 12 }}>
        <Card title="This week" subtitle="Tap a day to see agenda">
          <View style={{ flexDirection: "row", gap: 10 }}>
            {days.map((x, idx) => {
              const isOn = idx === selected;
              return (
                <Pressable
                  key={x.d}
                  onPress={() => setSelected(idx)}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: isOn ? "rgba(124,92,255,0.22)" : "rgba(234,240,255,0.06)",
                      borderColor: isOn ? "rgba(124,92,255,0.55)" : theme.border,
                    },
                  ]}
                >
                  <Text style={{ color: isOn ? theme.text : theme.subtext, fontWeight: "700" }}>{x.d}</Text>
                  <Text style={{ color: isOn ? theme.text : theme.muted, marginTop: 2 }}>{x.n}</Text>
                </Pressable>
              );
            })}
          </View>
        </Card>

        <Card title="Agenda" subtitle="Your schedule for the selected day">
          <View style={{ gap: 10 }}>
            {agenda.map((a) => (
              <View key={a.id} style={styles.listItem}>
                <View style={{ width: 78 }}>
                  <Text style={{ color: theme.text, fontWeight: "700" }}>{a.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{a.title}</Text>
                  <Text style={styles.itemMeta}>{a.tag}</Text>
                </View>
                <Pill label="Event" tone="muted" />
              </View>
            ))}
          </View>
        </Card>
      </View>
    </ScreenShell>
  );
}

/* -------------------- Tasks -------------------- */

function TasksScreen() {
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Refactor task list UI", dueLabel: "Today", tag: "Work", completed: false },
    { id: "2", title: "Buy groceries", dueLabel: "Today", tag: "Personal", completed: false },
    { id: "3", title: "Plan weekend workout", dueLabel: "Sat", tag: "Health", completed: true },
    { id: "4", title: "Prepare invoices", dueLabel: "Next week", tag: "Work", completed: false },
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(q) || (t.tag ?? "").toLowerCase().includes(q));
  }, [query, tasks]);

  const toggle = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <ScreenShell title="Tasks">
      <View style={{ padding: 16, gap: 12 }}>
        <View style={styles.searchWrap}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search tasks by title or tag"
            placeholderTextColor={theme.muted}
            style={styles.search}
          />
          <Pressable style={styles.searchBtn}>
            <Text style={{ color: theme.text, fontWeight: "800" }}>＋</Text>
          </Pressable>
        </View>

        <Card title="Task list" subtitle="Tap the checkbox to complete">
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Checkbox checked={item.completed} onToggle={() => toggle(item.id)} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.itemTitle,
                      item.completed && { color: theme.muted, textDecorationLine: "line-through" },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {item.dueLabel} • <Text style={{ color: theme.subtext }}>{item.tag}</Text>
                  </Text>
                </View>
                <Pill label={item.completed ? "Done" : "Active"} tone={item.completed ? "good" : "accent"} />
              </View>
            )}
            scrollEnabled={false}
          />
        </Card>
      </View>
    </ScreenShell>
  );
}

/* -------------------- Reminders -------------------- */

function RemindersScreen() {
  const [items, setItems] = useState<Reminder[]>([
    { id: "r1", title: "Take vitamins", timeLabel: "8:00 AM", group: "Today", done: false },
    { id: "r2", title: "Water plants", timeLabel: "7:00 PM", group: "Today", done: false },
    { id: "r3", title: "Call mom", timeLabel: "Tomorrow • 6:00 PM", group: "Tomorrow", done: false },
    { id: "r4", title: "Renew subscription", timeLabel: "Later • Jan 12", group: "Later", done: false },
  ]);

  const groups: Array<Reminder["group"]> = ["Today", "Tomorrow", "Later"];

  const markDone = (id: string) => setItems((p) => p.map((x) => (x.id === id ? { ...x, done: true } : x)));
  const snooze = (id: string) =>
    setItems((p) => p.map((x) => (x.id === id ? { ...x, timeLabel: "Snoozed • 30 min" } : x)));

  return (
    <ScreenShell title="Reminders">
      <View style={{ padding: 16, gap: 12 }}>
        {groups.map((g) => {
          const data = items.filter((x) => x.group === g);
          if (!data.length) return null;
          return (
            <Card key={g} title={g} subtitle="Time-based reminders">
              <View style={{ gap: 10 }}>
                {data.map((r) => (
                  <View key={r.id} style={styles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemTitle, r.done && { color: theme.muted, textDecorationLine: "line-through" }]}>
                        {r.title}
                      </Text>
                      <Text style={styles.itemMeta}>{r.timeLabel}</Text>
                    </View>

                    {r.done ? (
                      <Pill label="Done" tone="good" />
                    ) : (
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <Pressable onPress={() => snooze(r.id)} style={[styles.smallBtn, { backgroundColor: "rgba(255,176,32,0.16)" }]}>
                          <Text style={[styles.smallBtnText, { color: theme.warn }]}>Snooze</Text>
                        </Pressable>
                        <Pressable onPress={() => markDone(r.id)} style={[styles.smallBtn, { backgroundColor: "rgba(56,211,159,0.16)" }]}>
                          <Text style={[styles.smallBtnText, { color: theme.good }]}>Done</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Card>
          );
        })}
      </View>
    </ScreenShell>
  );
}

/* -------------------- Settings -------------------- */

function SettingsScreen() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [dark, setDark] = useState(true);

  return (
    <ScreenShell title="Settings">
      <View style={{ padding: 16, gap: 12 }}>
        <Card title="Profile" subtitle="Account and preferences">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={styles.avatar}>
              <Text style={{ color: theme.text, fontWeight: "900" }}>U</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text, fontSize: 16, fontWeight: "800" }}>Your Name</Text>
              <Text style={{ color: theme.subtext }}>user@email.com</Text>
            </View>
            <Pill label="Pro" tone="accent" />
          </View>
        </Card>

        <Card title="Notifications">
          <RowButton
            title="Push notifications"
            subtitle="Reminders and due tasks"
            right={<Switch value={push} onValueChange={setPush} />}
          />
          <View style={styles.sep} />
          <RowButton
            title="Email summaries"
            subtitle="Weekly planning recap"
            right={<Switch value={email} onValueChange={setEmail} />}
          />
        </Card>

        <Card title="Appearance">
          <RowButton title="Dark mode" subtitle="Reduce glare at night" right={<Switch value={dark} onValueChange={setDark} />} />
        </Card>

        <Card title="General">
          <RowButton title="Data & backup" subtitle="Export / restore" />
          <View style={styles.sep} />
          <RowButton title="Privacy" subtitle="Permissions and analytics" />
          <View style={styles.sep} />
          <RowButton title="Help" subtitle="FAQs and support" />
        </Card>
      </View>
    </ScreenShell>
  );
}

/* -------------------- App Root -------------------- */

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.panel2,
            borderTopColor: "transparent",
            height: Platform.select({ ios: 86, android: 70, default: 70 }),
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: theme.muted,
          tabBarLabelStyle: { fontSize: 12, fontWeight: "700", paddingBottom: 6 },
        }}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Calendar" component={CalendarScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Reminders" component={RemindersScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingTop: Platform.select({ ios: 60, android: 24, default: 24 }),
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hTitle: { color: theme.text, fontSize: 26, fontWeight: "900", letterSpacing: 0.2 },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: theme.panel,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { color: theme.text, fontSize: 18, fontWeight: "900" },

  card: {
    backgroundColor: theme.panel,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 18,
    padding: 14,
    shadowOpacity: 0.12,
  },
  cardTitle: { color: theme.text, fontSize: 16, fontWeight: "900" },
  cardSubtitle: { color: theme.subtext, marginTop: 4 },

  bigNumber: { color: theme.text, fontSize: 26, fontWeight: "900" },
  smallLabel: { color: theme.subtext, marginTop: 2 },

  actionBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  actionBtnTitle: { color: theme.text, fontSize: 14, fontWeight: "900" },
  actionBtnSubtitle: { color: theme.subtext, marginTop: 4 },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "rgba(234,240,255,0.04)",
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 14,
  },
  itemTitle: { color: theme.text, fontWeight: "800", fontSize: 14 },
  itemMeta: { color: theme.muted, marginTop: 4 },

  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontSize: 12, fontWeight: "900" },

  dayChip: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  searchWrap: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  search: {
    flex: 1,
    backgroundColor: theme.panel,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.text,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: "rgba(124,92,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(124,92,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    just
