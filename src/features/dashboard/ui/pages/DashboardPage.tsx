import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { useAppDispatch } from "../../../../modules/store/store";
import { fetchDashboardStats } from "../../store/dashboardThunks";
import type { AppState } from "../../../../modules/store/store";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading, error } = useSelector((state: AppState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (!stats) return null;

  // Transformer eventsByMonth pour recharts
  const monthlyData = Object.entries(stats.eventsByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Tableau de bord
      </Typography>

      {/* ── 4 métriques clés ── */}
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Événements créés", value: stats.totalEvents, color: "#6366f1" },
          { label: "Organisateurs", value: stats.totalOrganizers, color: "#22c55e" },
          { label: "Événements à venir", value: stats.upcomingEvents, color: "#f59e0b" },
          { label: "Événements passés", value: stats.pastEvents, color: "#64748b" },
        ].map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.label}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: metric.color }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Graphique : événements par mois ── */}
        <Grid item xs={12} md={7}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>Événements par mois</Typography>
              {monthlyData.length === 0 ? (
                <Typography color="text.secondary">Aucune donnée disponible</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Graphique : événements par catégorie ── */}
        <Grid item xs={12} md={5}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>Par catégorie</Typography>
              {stats.eventsByCategory.length === 0 ? (
                <Typography color="text.secondary">Aucune donnée disponible</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.eventsByCategory}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {stats.eventsByCategory.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Prochains événements ── */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" mb={2}>Prochains événements</Typography>
              {stats.nextEvents.length === 0 ? (
                <Typography color="text.secondary">Aucun événement à venir</Typography>
              ) : (
                <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ borderBottom: "2px solid", borderColor: "divider" }}>
                      {["Titre", "Date", "Capacité", "Prix"].map(h => (
                        <Box component="th" key={h} sx={{ p: 1, textAlign: "left" }}>
                          <Typography variant="body2" fontWeight="bold">{h}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {stats.nextEvents.map((event) => (
                      <Box component="tr" key={event.id} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                        <Box component="td" sx={{ p: 1 }}>{event.title}</Box>
                        <Box component="td" sx={{ p: 1 }}>
                          {new Date(event.startDate).toLocaleDateString("fr-FR")}
                        </Box>
                        <Box component="td" sx={{ p: 1 }}>{event.capacity}</Box>
                        <Box component="td" sx={{ p: 1 }}>{event.price} €</Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
