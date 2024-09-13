import React, { useState, useEffect } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import ProductTableSingle from "./AuctionTable";
import { AuctionApi, CreateAuctionRequest } from "../../../api/api";
import { useAuth } from "../../modules/auth";
import { toast } from "react-toastify";
import { showAlert } from "../../../utils/Alert";
import { useMutation, useQueryClient } from "react-query";
import { Spinner } from "react-bootstrap";

const CreateAuction = () => {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [stepIncrementPercentage, setStepIncrementPercentage] =
    useState<number>(1);
  const [depositFee, setDepositFee] = useState<string>("0");
  const [minDate, setMinDate] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [timeError, setTimeError] = useState<string>("");

  const auctionApi = new AuctionApi();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const now = new Date();
    const todayString = now.toISOString().split("T")[0];
    setMinDate(todayString);
    setSelectedDate(todayString);

    // Set initial start and end times to current time
    const currentTime = now.toTimeString().slice(0, 5);
    setStartTime(currentTime);
    setEndTime(currentTime);
  }, []);

  const validateTimes = (newStartTime: string, newEndTime: string) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const startDateTime = getValidDateTime(selectedDate, newStartTime);
    const endDateTime = getValidDateTime(selectedDate, newEndTime);

    if (selectedDate === today && startDateTime && startDateTime <= now) {
      setTimeError("Start time must be in the future.");
      return false;
    }

    if (startDateTime && endDateTime && endDateTime <= startDateTime) {
      setTimeError("End time must be after start time.");
      return false;
    }

    setTimeError("");
    return true;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (newDate < today) {
      setDateError("Selected date cannot be in the past.");
      return;
    }

    setDateError("");
    setSelectedDate(newDate);
    validateTimes(startTime, endTime);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    validateTimes(newStartTime, endTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    validateTimes(startTime, newEndTime);
  };

  const getValidDateTime = (date: string, time: string): Date | null => {
    if (!date || !time) return null;
    const dateTime = new Date(`${date}T${time}:00+07:00`);
    return isNaN(dateTime.getTime()) ? null : dateTime;
  };

  const startDateTime = getValidDateTime(selectedDate, startTime);
  const endDateTime = getValidDateTime(selectedDate, endTime);

  const createAuctionMutation = useMutation(
    (data: CreateAuctionRequest) => auctionApi.apiAuctionsPost(data),
    {
      onSuccess: () => {
        toast.success("Auction created successfully!");
        queryClient.invalidateQueries("auctions"); // Invalidate and refetch auctions list
        // Reset form or redirect to auction list
        resetForm();
      },
      onError: (error) => {
        console.error("Error creating auction:", error);
        showAlert(
          "error",
          error instanceof Error ? error.message : "Failed to create auction."
        );
      },
    }
  );

  const resetForm = () => {
    setSelectedItem("");
    setTitle("");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setStartTime(new Date().toTimeString().slice(0, 5));
    setEndTime(new Date().toTimeString().slice(0, 5));
    setStepIncrementPercentage(1);
    setDepositFee("0");
    setDateError("");
    setTimeError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateTimes(startTime, endTime)) {
      return;
    }

    if (!selectedItem) {
      showAlert("error", "Please select an item for the auction.");
      return;
    }

    const auctionData: CreateAuctionRequest = {
      title,
      shopId: currentUser?.shopId || "",
      auctionItemId: selectedItem,
      startTime: startDateTime?.toISOString() || "",
      endTime: endDateTime?.toISOString() || "",
      stepIncrementPercentage,
      depositFee: Number(depositFee),
    };

    createAuctionMutation.mutate(auctionData);
  };

  return (
    <Content>
      <h1>Create Auction</h1>
      <div
        id="kt_app_content_container"
        className="app-container container-xxl"
      >
        <form
          id="kt_create_auction_form"
          className="form d-flex flex-column flex-lg-row"
          onSubmit={handleSubmit}
        >
          <div className="w-100 flex-lg-row-auto w-lg-300px mb-7 me-7 me-lg-10">
            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Auction Details</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <div className="d-flex flex-column gap-10">
                  <div className="fv-row">
                    <label className="required form-label">Auction Title</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter auction title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="fv-row">
                    <label className="required form-label">Auction Date</label>
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={selectedDate}
                      onChange={handleDateChange}
                      min={minDate}
                      required
                    />
                    {dateError && (
                      <div className="text-danger">{dateError}</div>
                    )}
                  </div>

                  <div className="fv-row">
                    <label className="required form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-control mb-2"
                      value={startTime}
                      onChange={handleStartTimeChange}
                      required
                    />
                  </div>

                  <div className="fv-row">
                    <label className="required form-label">End Time</label>
                    <input
                      type="time"
                      className="form-control mb-2"
                      value={endTime}
                      onChange={handleEndTimeChange}
                      required
                    />
                  </div>

                  {timeError && <div className="text-danger">{timeError}</div>}

                  <div className="fv-row">
                    <label className="required form-label">
                      Step Increment Percentage
                    </label>
                    <input
                      type="number"
                      className="form-control mb-2"
                      placeholder="Enter step increment percentage"
                      value={stepIncrementPercentage}
                      onChange={(e) => {
                        const value = Math.min(
                          Math.max(1, Number(e.target.value)),
                          100
                        );
                        setStepIncrementPercentage(value);
                      }}
                      min="1"
                      max="100"
                      required
                    />
                  </div>

                  <div className="fv-row">
                    <label className="required form-label">Deposit Fee</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter deposit fee"
                      value={depositFee}
                      onChange={(e) => setDepositFee(e.target.value)}
                    />
                  </div>

                  <div className="mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        createAuctionMutation.isLoading ||
                        dateError !== "" ||
                        timeError !== ""
                      }
                    >
                      {createAuctionMutation.isLoading ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            className="me-2"
                          />
                          Creating Auction...
                        </>
                      ) : (
                        "Create Auction"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-lg-row-fluid gap-7 gap-lg-10">
            <div className="card card-flush py-4">
              <div className="card-header">
                <div className="card-title">
                  <h2>Select Product for Auction</h2>
                </div>
              </div>
              <div className="card-body pt-0">
                <ProductTableSingle
                  selectedItem={selectedItem}
                  setSelectedItem={setSelectedItem}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Content>
  );
};

export default CreateAuction;
