import type { BooleanLicenseFeature } from '@n8n/constants';
import { LICENSE_FEATURES, UNLIMITED_LICENSE_QUOTA } from '@n8n/constants';
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
	/*
	 * If the feature is a string. checks if the feature is licensed
	 * If the feature is an array of strings, it checks if any of the features are licensed
	 */
	isLicensed(feature: BooleanLicenseFeature | BooleanLicenseFeature[]) {
		this.assertProvider();

		if (typeof feature === 'string') return this.licenseProvider.isLicensed(feature);

		for (const featureName of feature) {
			if (this.licenseProvider.isLicensed(featureName)) {
				return true;
			}
		}

		return false;
	}

	getValue<T extends keyof FeatureReturnType>(feature: T): FeatureReturnType[T] {
		this.assertProvider();

		return this.licenseProvider.getValue(feature);
	}

	// --------------------
	//      booleans
	// --------------------

	isCustomRolesLicensed() {
		return this.isLicensed(LICENSE_FEATURES.CUSTOM_ROLES);
	}

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

	isMFAEnforcementLicensed() {
		return this.isLicensed('feat:mfaEnforcement');
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

	isWorkflowDiffsLicensed() {
		return this.isLicensed('feat:workflowDiffs');
	}

	isProvisioningLicensed() {
		return this.isLicensed(['feat:saml', 'feat:oidc', 'feat:ldap']);
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
