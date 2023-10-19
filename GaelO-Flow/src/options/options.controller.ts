import { Body, Controller, Get, Put, HttpException } from '@nestjs/common';
import { OptionsService } from './options.service';
import { Option } from './option.entity';
import { OptionDto } from './options.dto';


@Controller('/options')
export class OptionsController {
  constructor(private readonly OptionService: OptionsService) {}

  @Get()
  async getOptions(): Promise<Option> {
    let options = await this.OptionService.getOptions();
    delete options.id;

    return options;
  }

  @Put() // TODO: change to patch, https://docs.nestjs.com/techniques/validation#parsing-and-validating-arrays
  async update(@Body() options: OptionDto): Promise<void> {
    const option = await this.OptionService.getOptions();

    if (!option) throw new HttpException('Option not found', 404);

    if (options.ldap_type) option.ldap_type = options.ldap_type;
    if (options.ldap_protocol) option.ldap_protocol = options.ldap_protocol;
    if (options.ldap_server) option.ldap_server = options.ldap_server;
    if (options.ldap_port) option.ldap_port = options.ldap_port;
    if (options.ldap_base_dn) option.ldap_base_dn = options.ldap_base_dn;
    if (options.ladp_bind_dn) option.ladp_bind_dn = options.ladp_bind_dn;
    if (options.ldap_bind_password) option.ldap_bind_password = options.ldap_bind_password;
    if (options.ldap_group) option.ldap_group = options.ldap_group;
    if (options.ldap_user) option.ldap_user = options.ldap_user;
    if (options.auto_query_hour_start) option.auto_query_hour_start = options.auto_query_hour_start;
    if (options.auto_query_minute_start) option.auto_query_minute_start = options.auto_query_minute_start;
    if (options.auto_query_hour_stop) option.auto_query_hour_stop = options.auto_query_hour_stop;
    if (options.auto_query_minute_stop) option.auto_query_minute_stop = options.auto_query_minute_stop;
    if (options.use_ldap) option.use_ldap = options.use_ldap;
    if (options.orthanc_monitoring_rate) option.orthanc_monitoring_rate = options.orthanc_monitoring_rate;
    if (options.burner_started) option.burner_started = options.burner_started;
    if (options.burner_label_path) option.burner_label_path = options.burner_label_path;
    if (options.burner_monitoring_level) option.burner_monitoring_level = options.burner_monitoring_level;
    if (options.burner_manifacturer) option.burner_manifacturer = options.burner_manifacturer;
    if (options.burner_monitored_path) option.burner_monitored_path = options.burner_monitored_path;
    if (options.burner_delete_study_after_sent) option.burner_delete_study_after_sent = options.burner_delete_study_after_sent;
    if (options.burner_support_type) option.burner_support_type = options.burner_support_type;
    if (options.burner_viewer_path) option.burner_viewer_path = options.burner_viewer_path;
    if (options.burner_transfer_syntax) option.burner_transfer_syntax = options.burner_transfer_syntax;
    if (options.burner_date_format) option.burner_date_format = options.burner_date_format;
    if (options.burner_transcoding) option.burner_transcoding = options.burner_transcoding;
    if (options.autorouter_started) option.autorouter_started = options.autorouter_started;
  
    return await this.OptionService.update(option);

  };


}
