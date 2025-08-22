import React, { useState, useEffect, useRef } from "react";
import { CalendarCheck2 } from "lucide-react";
import { getPatientAppointments, Appointment as ApiAppointment } from "../../services/Appointmentapi";
import { formatDate, formatTimeOnly } from "../../utils/formatDate"; // Import date formatting utilities

// Cool D3 Loader
const D3CoolLoader: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    import("d3").then((d3) => {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      const width = 80,
        height = 80,
        r = 24,
        num = 6;
      const colors = [
        "#facc15",
        "#fde047",
        "#fbbf24",
        "#f59e42",
        "#f472b6",
        "#38bdf8",
      ];
      const group = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);
      for (let i = 0; i < num; i++) {
        group
          .append("circle")
          .attr("r", 7)
          .attr("fill", colors[i % colors.length])
          .attr("cx", r * Math.cos((2 * Math.PI * i) / num))
          .attr("cy", r * Math.sin((2 * Math.PI * i) / num))
          .attr("opacity", 0.8)
          .attr("class", `d3-cool-loader-dot-${i}`);
      }
      function animate() {
        for (let i = 0; i < num; i++) {
          group
            .select(`.d3-cool-loader-dot-${i}`)
            .transition()
            .duration(1200)
            .delay(i * 100)
            .attrTween("transform", () =>
              d3.interpolateString("scale(1)", "scale(1.5)")
            )
            .transition()
            .duration(1200)
            .attrTween("transform", () =>
              d3.interpolateString("scale(1.5)", "scale(1)")
            );
        }
        group
          .transition()
          .duration(2400)
          .attrTween("transform", () =>
            d3.interpolateString(
              `rotate(0,0,0) translate(${width / 2},${height / 2})`,
              `rotate(360,0,0) translate(${width / 2},${height / 2})`
            )
          )
          .on("end", animate);
      }
      animate();
    });
  }, []);

  return <svg ref={ref} width={80} height={80} />;
};

const History: React.FC = () => {
  const [history, setHistory] = useState<ApiAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace with actual patientId logic as needed
  const patientId = localStorage.getItem("userId") || "1";

  useEffect(() => {
    setLoading(true);
    getPatientAppointments(patientId)
      .then((res) => {
        setHistory(Array.isArray(res.data) ? res.data : []);
      })
      .finally(() => setLoading(false));
  }, [patientId]);

  return (
    <div className="w-full mb-20">
      <div className="flex items-center mb-5">
        <CalendarCheck2 className="text-yellow-700 mr-2" size={28} />
        <h2 className="text-2xl font-bold text-yellow-700">
          Appointment History
        </h2>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <D3CoolLoader />
            <div className="mt-4 text-yellow-700 font-semibold text-lg animate-pulse">
              Loading your history...
            </div>
          </div>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No appointment history found.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Provider</th>
                <th className="px-4 py-2 text-left">Notes</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id!} className="border-t">
                  <td className="px-4 py-2">{formatDate(item.dateTime)}</td>
                  <td className="px-4 py-2">{formatTimeOnly(item.dateTime)}</td>
                  <td className="px-4 py-2">
                    {typeof item.providerId === 'string' ? item.providerId : item.providerId?.name}
                  </td>
                  <td className="px-4 py-2">{item.notes || '-'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            item.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : item.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                    >
                      {item.status
                        ? item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)
                        : "Scheduled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
