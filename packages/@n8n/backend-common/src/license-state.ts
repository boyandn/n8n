import type { BooleanLicenseFeature } from '@n8n/constants';
import { UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
import { Service } from '@n8n/di';
import { UnexpectedError } from 'n8n-workflow';

import type { FeatureReturnType, LicenseProvider } from './types';

class ProviderNotSetError extends UnexpectedError {
	constructor() {
		super('Cannot query license state because license provider has not been set');
	}
}

@Service()
export class LicenseState {
	licenseProvider: LicenseProvider | null = null;

	setLicenseProvider(provider: LicenseProvider) {
		this.licenseProvider = provider;
	}

	private assertProvider(): asserts this is { licenseProvider: LicenseProvider } {
		if (!this.licenseProvider) throw new ProviderNotSetError();
	}

	// --------------------
	//     core queries
	// --------------------

	isLicensed(feature: BooleanLicenseFeature) {
		this.assertProvider();

		return this.licenseProvider.isLicensed(feature);
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		this.assertProvider();

		return this.licenseProvider.getValue(feature);
	}

	// --------------------
	//      booleans
	// --------------------

	isSharingLicensed() {
		return true;
	}

	isLogStreamingLicensed() {
		return true;
	}

	isLdapLicensed() {
		return true;
	}

	isSamlLicensed() {
		return true;
	}

	isOidcLicensed() {
		return true;
	}

	isApiKeyScopesLicensed() {
		return true;
	}

	isAiAssistantLicensed() {
		return false;
	}

	isAskAiLicensed() {
		return false;
	}

	isAiCreditsLicensed() {
		return false;
	}

	isAdvancedExecutionFiltersLicensed() {
		return true;
	}

	isAdvancedPermissionsLicensed() {
		return true;
	}

	isDebugInEditorLicensed() {
		return true;
	}

	isBinaryDataS3Licensed() {
		return true;
	}

	isMultiMainLicensed() {
		return true;
	}

	isVariablesLicensed() {
		return true;
	}

	isSourceControlLicensed() {
		return true;
	}

	isExternalSecretsLicensed() {
		return true;
	}

	isWorkflowHistoryLicensed() {
		return true;
	}

	isAPIDisabled() {
		return false;
	}

	isWorkerViewLicensed() {
		return true;
	}

	isProjectRoleAdminLicensed() {
		return true;
	}

	isProjectRoleEditorLicensed() {
		return true;
	}

	isProjectRoleViewerLicensed() {
		return true;
	}

	isCustomNpmRegistryLicensed() {
		return true;
	}

	isFoldersLicensed() {
		return true;
	}

	isInsightsSummaryLicensed() {
		return true;
	}

	isInsightsDashboardLicensed() {
		return true;
	}

	isInsightsHourlyDataLicensed() {
		return true;
	}

	// --------------------
	//      integers
	// --------------------

	getMaxUsers() {
		return  UNLIMITED_LICENSE_QUOTA;
	}

	getMaxActiveWorkflows() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxVariables() {
		return  UNLIMITED_LICENSE_QUOTA;
	}

	getMaxAiCredits() {
		return this.getValue('quota:aiCredits') ?? 0;
	}

	getWorkflowHistoryPruneQuota() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getInsightsMaxHistory() {
		return this.getValue('quota:insights:maxHistoryDays') ?? 7;
	}

	getInsightsRetentionMaxAge() {
		return this.getValue('quota:insights:retention:maxAgeDays') ?? 180;
	}

	getInsightsRetentionPruneInterval() {
		return this.getValue('quota:insights:retention:pruneIntervalDays') ?? 24;
	}

	getMaxTeamProjects() {
		return UNLIMITED_LICENSE_QUOTA;
	}

	getMaxWorkflowsWithEvaluations() {
		return this.getValue('quota:evaluations:maxWorkflows') ?? 0;
	}
}
