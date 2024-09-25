import React, { useCallback, useEffect, useRef, useState } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { useThemeMode } from "../../../_metronic/partials";
import { DashboardApi } from "../../../api";

type Props = {
  className: string;
};

const getChartOptions = (revenueData: number[], categories: string[]): ApexOptions => {
  return {
    series: [
      {
        name: "Revenue",
        data: revenueData,
      },
    ],
    chart: {
      fontFamily: "inherit",
      type: "line", // Ensure this is set to 'line' for a line chart
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories,
    },
    stroke: {
      curve: 'smooth', // Make the line smooth
      width: 2,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };
};

const ChartAdmin: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: "",
    endDate: "",
  });
  const [chartOptions, setChartOptions] = useState<ApexOptions>(getChartOptions([], []));

  const refreshMode = useCallback(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(chartRef.current, chartOptions);
    chart.render();
    return chart;
  }, [chartOptions]);

  useEffect(() => {
    const chart = refreshMode();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, chartOptions, refreshMode]);

  const fetchRevenueData = async (startDate: string, endDate: string) => {
    const revenueAPI = new DashboardApi();

    // Call the API with start and end dates
    const revResponse = await revenueAPI.apiDashboardSystemRevenueGet(startDate, endDate);

    // Extract the total revenue and ensure it's a number or array
    const totalRevenue = revResponse.data.totalRevenue; // Assuming this is a number
    const formattedData: number[] = Array.isArray(totalRevenue) ? totalRevenue : totalRevenue !== undefined ? [totalRevenue] : [];

    // Assuming the API returns the start and end dates in the response
    const categoriesData: any = [revResponse.data.startDate, revResponse.data.endDate].filter(date => date); // Adjust based on your API response

    console.log('Formatted Data:', formattedData);
    console.log('Categories:', categoriesData);

    setRevenueData(formattedData);
    setCategories(categoriesData);
    
    // Set the chart options with the formatted data
    setChartOptions(getChartOptions(formattedData, categoriesData));
  };

  const handleDateChange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      fetchRevenueData(dateRange.startDate, dateRange.endDate);
    }
  };

  return (
    <div className="row --gap-5">
      <div className="col-24">
        <div className="row">
          <div className="col-xl">
            <div className={`card ${className}`}>
              <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                  <span className="card-label fw-bold fs-3 mb-1">
                    System Revenue Overview
                  </span>
                  <span className="text-muted fw-semibold fs-7">
                    Select a date range to view revenue fluctuations
                  </span>
                </h3>
                <div className="card-toolbar">
                  <input
                    type="date"
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="form-control me-2"
                  />
                  <input
                    type="date"
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="form-control me-2"
                  />
                  <button
                    onClick={handleDateChange}
                    className="btn btn-primary"
                  >
                    Fetch Revenue
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div
                  ref={chartRef}
                  id="kt_charts_widget_3_chart"
                  style={{ height: "350px" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChartAdmin };
