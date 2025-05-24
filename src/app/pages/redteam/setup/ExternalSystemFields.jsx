import { Box, Stack, Typography, Switch } from '@mui/material';
import LabeledTextField from './LabelledTextField';

export default function ExternalSystemFields({
  enabled,
  onToggle,
  values,
  onFieldChange,
}) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 1 }}>
        External System Access
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Switch
          checked={enabled}
          onChange={onToggle}
          inputProps={{ 'aria-label': 'toggle external system access' }}
        />
        <Typography>This application connects to external systems</Typography>
      </Box>
      {enabled && (
        <Stack spacing={2}>
          <LabeledTextField
            label=""
            description="What external systems are connected to this application?"
            fullWidth
            value={values.connectedSystems}
            onChange={(e) => onFieldChange('connectedSystems', e.target.value)}
            multiline
            rows={2}
            placeholder="e.g. A CRM system for managing customer relationships. Flight booking system. Internal company knowledge base."
          />
          <LabeledTextField
            label=""
            description="What data is available to the LLM from connected systems that the user has access to?"
            fullWidth
            value={values.accessToData}
            onChange={(e) => onFieldChange('accessToData', e.target.value)}
            multiline
            rows={2}
            placeholder="e.g. Flight prices and schedules, their own profile and purchase history. Basic HR information like holiday schedules, expense policy. 2024 Company plans, budget allocations and org chart."
          />
          <LabeledTextField
            label=""
            description="What data is available to the LLM from connected systems that the user shouldn't have access to?"
            fullWidth
            value={values.forbiddenData}
            onChange={(e) => onFieldChange('forbiddenData', e.target.value)}
            multiline
            rows={2}
            placeholder="e.g. Other users' profiles and purchase history. Sensitive company information like financials, strategy, other employee data."
          />
          <LabeledTextField
            label=""
            description="What actions can the user take on connected systems?"
            fullWidth
            value={values.accessToActions}
            onChange={(e) => onFieldChange('accessToActions', e.target.value)}
            multiline
            rows={2}
            placeholder="e.g. Update their profile, search for flights, book flights, view purchase history, view HR information."
          />
          <LabeledTextField
            label=""
            description="What actions shouldn't the user be able to take on connected systems?"
            fullWidth
            value={values.forbiddenActions}
            onChange={(e) => onFieldChange('forbiddenActions', e.target.value)}
            multiline
            rows={2}
            placeholder="e.g. Update other users' profile, cancel other users' flights."
          />
        </Stack>
      )}
    </Box>
  );
}
