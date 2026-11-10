import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/utils/api';

export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchInquiries',
  async ({ role, token }, { rejectWithValue }) => {
    try {
      const endpoint = role === 'admin' ? '/admin/inquiries' : '/vendor/inquiries';
      const data = await apiRequest(endpoint, { token });
      return data.inquiries || data;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch inquiries');
    }
  }
);

export const submitInquiry = createAsyncThunk(
  'inquiries/submitInquiry',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/inquiries', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      return response;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to send inquiry');
    }
  }
);

export const updateInquiryStatus = createAsyncThunk(
  'inquiries/updateStatus',
  async ({ id, status, token, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === 'admin' ? `/admin/inquiries/${id}/status` : `/vendor/inquiries/${id}/status`;
      const response = await apiRequest(endpoint, {
        method: 'PATCH',
        token,
        body: JSON.stringify({ status }),
      });
      return { id, status, updated: response };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Failed to update status');
    }
  }
);

const inquiriesSlice = createSlice({
  name: 'inquiries',
  initialState: {
    items: [],
    loading: false,
    submitting: false,
    submitSuccess: false,
    error: null,
    statusFilter: 'all',
  },
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    resetSubmitStatus: (state) => {
      state.submitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Inquiries
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Inquiry
      .addCase(submitInquiry.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.error = null;
      })
      .addCase(submitInquiry.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitSuccess = true;
        if (action.payload?.inquiry) {
          state.items.unshift(action.payload.inquiry);
        }
      })
      .addCase(submitInquiry.rejected, (state, action) => {
        state.submitting = false;
        state.submitSuccess = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const item = state.items.find((i) => (i.id || i._id) === id);
        if (item) {
          item.status = status;
        }
      });
  },
});

export const { setStatusFilter, resetSubmitStatus } = inquiriesSlice.actions;

export const selectInquiries = (state) => state.inquiries.items;
export const selectInquiriesLoading = (state) => state.inquiries.loading;
export const selectInquiriesSubmitting = (state) => state.inquiries.submitting;
export const selectInquiriesSuccess = (state) => state.inquiries.submitSuccess;
export const selectInquiriesError = (state) => state.inquiries.error;
export const selectStatusFilter = (state) => state.inquiries.statusFilter;

export default inquiriesSlice.reducer;

