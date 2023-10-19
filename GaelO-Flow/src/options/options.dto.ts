export class OptionDto {
	ldap_type: string;
	ldap_protocol: string;
	ldap_server: string;
	ldap_port: number;
	ldap_base_dn: string;
	ladp_bind_dn: string;
	ldap_bind_password: string;
	ldap_group: string;
	ldap_user: string;
	auto_query_hour_start: number;
	auto_query_minute_start: number;
	auto_query_hour_stop: number;
	auto_query_minute_stop: number;
	use_ldap: boolean;
	orthanc_monitoring_rate: number;
	burner_started: boolean;
	burner_label_path: string;
	burner_monitoring_level: string;
	burner_manifacturer: string;
	burner_monitored_path: string;
	burner_delete_study_after_sent: boolean;
	burner_support_type: string;
	burner_viewer_path: string;
	burner_transfer_syntax: string;
	burner_date_format: string;
	burner_transcoding: string;
	autorouter_started: boolean;
  }
  