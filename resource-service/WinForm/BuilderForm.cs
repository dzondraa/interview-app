using BusinessLayer;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace WinForm
{
    public partial class BuilderForm : Form
    {
        private DocExtractor _extractor;
        public BuilderForm(DocExtractor extractor)
        {
            InitializeComponent();
            _extractor = extractor;
        }

        private void BuilderForm_Load(object sender, EventArgs e)
        {

        }
    }
}
