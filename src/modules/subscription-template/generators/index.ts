import { XrayJsonGeneratorService } from './xray-json.generator.service';
import { OutlineGeneratorService } from './outline.generator.service';
import { SingBoxGeneratorService } from './singbox.generator.service';
import { MihomoGeneratorService } from './mihomo.generator.service';
import { ClashGeneratorService } from './clash.generator.service';
import { XrayGeneratorService } from './xray.generator.service';
import { FormatHostsService } from './format-hosts.service';

export const TEMPLATE_RENDERERS = [
    FormatHostsService,
    MihomoGeneratorService,
    ClashGeneratorService,
    OutlineGeneratorService,
    XrayGeneratorService,
    SingBoxGeneratorService,
    XrayJsonGeneratorService,
];
